import { render } from "@testing-library/react";
import {
  toastICONS,
  FILTER,
  FLECHA,
  CORAZON,
} from "../iconos";

describe("ICONOS", () => {
  const renderIcon = (icon: any) =>
    render(<div>{typeof icon === "function" ? icon() : icon}</div>);

  describe("toastICONS", () => {
    it("renders HEART icon", () => {
      const { container } = renderIcon(toastICONS.HEART());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders SKULL icon", () => {
      const { container } = renderIcon(toastICONS.SKULL());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders WARNING icon", () => {
      const { container } = renderIcon(toastICONS.WARNING());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders INFO icon", () => {
      const { container } = renderIcon(toastICONS.INFO());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders OK icon", () => {
      const { container } = renderIcon(toastICONS.OK());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders ENTER icon", () => {
      const { container } = renderIcon(toastICONS.ENTER());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders MAIL icon", () => {
      const { container } = renderIcon(toastICONS.MAIL());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders ARCADE icon", () => {
      const { container } = renderIcon(toastICONS.ARCADE());
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("standalone icons", () => {
    it("renders FILTER icon", () => {
      const { container } = renderIcon(FILTER);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders FLECHA icon", () => {
      const { container } = renderIcon(FLECHA);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders CORAZON icon", () => {
      const { container } = renderIcon(CORAZON);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});