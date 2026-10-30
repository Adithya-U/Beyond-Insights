import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scenes = document.querySelector<HTMLElement>("[data-story-scenes]");
const diagram = document.querySelector<SVGElement>("[data-story-diagram]");
const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]");

if (scenes && diagram && steps.length === 3) {
  const nodes = gsap.utils.toArray<SVGGElement>("[data-story-node]");
  const nodeLabels = gsap.utils.toArray<SVGTextElement>(".story-node__label");
  const links = gsap.utils.toArray<SVGLineElement>("[data-story-link]");
  const network = diagram.querySelector<SVGGElement>("[data-story-network]");
  const core = diagram.querySelector<SVGGElement>("[data-story-core]");
  const view = diagram.querySelector<SVGGElement>("[data-insight-view]");
  const bars = gsap.utils.toArray<SVGRectElement>("[data-story-bar]");
  const chartLine = diagram.querySelector<SVGPathElement>(".story-chart-line");
  const progressBar = document.querySelector<HTMLElement>("[data-story-progress]");
  const media = gsap.matchMedia();

  const coordinates = (element: SVGElement, prefix: string) => ({
    x: Number(element.dataset[`${prefix}X`]),
    y: Number(element.dataset[`${prefix}Y`]),
  });
  const scatteredNodes = nodes.map((node) => coordinates(node, "scatter"));
  const connectedNodes = nodes.map((node) => coordinates(node, "cluster"));
  const scatteredEnds = links.map((link) => ({ x: Number(link.dataset.scatterX2), y: Number(link.dataset.scatterY2) }));
  const connectedEnds = links.map((link) => ({ x: Number(link.dataset.clusterX2), y: Number(link.dataset.clusterY2) }));
  const initialViewTransform = "translate(92 42) scale(.8)";
  const finalViewTransform = "translate(0 0) scale(1)";
  const chartBaseline = 294;
  const barHeights = bars.map((bar) => Number(bar.dataset.height ?? 0));

  const activateStep = (activeIndex: number) => {
    steps.forEach((step, index) => step.classList.toggle("is-active", index === activeIndex));
    if (progressBar) gsap.to(progressBar, { scaleX: (activeIndex + 1) / steps.length, duration: 0.3, transformOrigin: "left", overwrite: true });
  };

  const setBars = (show: boolean, duration: number, ease: string) => gsap.to(bars, {
    attr: {
      y: (index) => show ? chartBaseline - barHeights[index] : chartBaseline,
      height: (index) => show ? barHeights[index] : 0,
    },
    duration,
    ease,
    overwrite: true,
  });

  const moveToStage = (stage: number, immediate = false) => {
    const duration = immediate ? 0 : 0.55;
    const ease = "power2.inOut";
    if (stage === 0) {
      gsap.to(network, { opacity: 1, duration, overwrite: true });
      gsap.to(core, { opacity: 0, y: 12, duration, overwrite: true });
      gsap.to(view, { attr: { transform: initialViewTransform }, opacity: 0, duration, overwrite: true });
      gsap.to(chartLine, { strokeDashoffset: 460, duration, overwrite: true });
      nodes.forEach((node, index) => gsap.to(node, {
        attr: { transform: `translate(${scatteredNodes[index].x} ${scatteredNodes[index].y})` },
        opacity: 1,
        duration,
        ease,
        overwrite: true,
      }));
      links.forEach((link, index) => gsap.to(link, {
        attr: { x1: scatteredNodes[index].x, y1: scatteredNodes[index].y, x2: scatteredEnds[index].x, y2: scatteredEnds[index].y },
        opacity: 0.28,
        duration,
        ease,
        overwrite: true,
      }));
      gsap.to(nodeLabels, { opacity: 1, duration, overwrite: true });
      setBars(false, duration, ease);
      activateStep(0);
      return;
    }

    if (stage === 1) {
      gsap.to(network, { opacity: 1, duration, overwrite: true });
      gsap.to(core, { opacity: 1, y: 0, duration, ease, overwrite: true });
      gsap.to(view, { attr: { transform: initialViewTransform }, opacity: 0, duration, overwrite: true });
      gsap.to(chartLine, { strokeDashoffset: 460, duration, overwrite: true });
      nodes.forEach((node, index) => gsap.to(node, {
        attr: { transform: `translate(${connectedNodes[index].x} ${connectedNodes[index].y})` },
        opacity: 0.82,
        duration,
        ease,
        overwrite: true,
      }));
      links.forEach((link, index) => gsap.to(link, {
        attr: { x1: connectedNodes[index].x, y1: connectedNodes[index].y, x2: connectedEnds[index].x, y2: connectedEnds[index].y },
        opacity: 0.82,
        duration,
        ease,
        overwrite: true,
      }));
      gsap.to(nodeLabels, { opacity: 0, duration, overwrite: true });
      setBars(false, duration, ease);
      activateStep(1);
      return;
    }

    gsap.to(network, { opacity: 0.12, duration, overwrite: true });
    gsap.to(core, { opacity: 0, y: 0, duration, overwrite: true });
    gsap.to(view, { attr: { transform: finalViewTransform }, opacity: 1, duration, ease, overwrite: true });
    gsap.to(chartLine, { strokeDashoffset: 0, duration: immediate ? 0 : 0.7, ease, overwrite: true });
    setBars(true, immediate ? 0 : 0.65, ease);
    activateStep(2);
  };

  if (progressBar) gsap.set(progressBar, { scaleX: 1 / 3, transformOrigin: "left" });

  media.add("(prefers-reduced-motion: reduce)", () => {
    moveToStage(2, true);
    steps.forEach((step) => step.classList.add("is-active"));
  });

  media.add("(prefers-reduced-motion: no-preference) and (min-width: 901px)", () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scenes,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => activateStep(self.progress < 0.39 ? 0 : self.progress < 0.72 ? 1 : 2),
      },
    });

    timeline.to(nodes, {
      attr: { transform: (index) => `translate(${connectedNodes[index].x} ${connectedNodes[index].y})` },
      opacity: 0.82,
      duration: 1,
      ease: "none",
    }, 0);
    timeline.to(links, {
      attr: {
        x1: (index) => connectedNodes[index].x,
        y1: (index) => connectedNodes[index].y,
        x2: (index) => connectedEnds[index].x,
        y2: (index) => connectedEnds[index].y,
      },
      opacity: 0.82,
      duration: 1,
      ease: "none",
    }, 0);
    timeline.to(nodeLabels, { opacity: 0, duration: 0.35, ease: "none" }, 0.32);
    timeline.to(core, { opacity: 1, y: 0, duration: 0.7, ease: "none" }, 0.3);
    timeline.to(network, { opacity: 0.12, duration: 0.4, ease: "none" }, 1.18);
    timeline.to(core, { opacity: 0, duration: 0.3, ease: "none" }, 1.18);
    timeline.to(view, { attr: { transform: finalViewTransform }, opacity: 1, duration: 0.6, ease: "none" }, 1.32);
    timeline.to(bars, {
      attr: {
        y: (index) => chartBaseline - barHeights[index],
        height: (index) => barHeights[index],
      },
      duration: 0.55,
      ease: "none",
    }, 1.42);
    timeline.to(chartLine, { strokeDashoffset: 0, duration: 0.6, ease: "none" }, 1.4);

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(element, { y: 18, opacity: 0.35 }, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });
  });

  media.add("(prefers-reduced-motion: no-preference) and (max-width: 900px)", () => {
    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 68%",
        end: "bottom 36%",
        onEnter: () => moveToStage(index),
        onEnterBack: () => moveToStage(index),
      });
    });
    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(element, { y: 14, opacity: 0.4 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 92%", once: true },
      });
    });
  });
}
