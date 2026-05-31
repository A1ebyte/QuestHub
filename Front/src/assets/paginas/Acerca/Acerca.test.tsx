import { render, screen } from "@testing-library/react";
import Acerca from "./Acerca";

// ---------------- MOCK CONTACTO ----------------

vi.mock("../../componentes/Contacto/Contacto.tsx", () => ({
  default: (props: any) => (
    <div data-testid="contacto">
      <span>{props.correo}</span>
      <span>{props.redes?.GitHub}</span>
      <span>{props.redes?.LinkedIn}</span>
    </div>
  ),
}));

// ---------------- TESTS ----------------

describe("Acerca component", () => {
  it("renders main title", () => {
    render(<Acerca />);
    expect(
      screen.getByRole("heading", { name: /acerca de questhub/i })
    ).toBeInTheDocument();
  });

  it("renders intro paragraphs", () => {
    render(<Acerca />);

    expect(screen.getByText(/QuestHub es una plataforma/i)).toBeInTheDocument();
    expect(screen.getByText(/Spring Boot/i)).toBeInTheDocument();
    expect(screen.getByText(/arquitectura y diseño/i)).toBeInTheDocument();
    expect(screen.getByText(/comunidad gamer/i)).toBeInTheDocument();
  });

  it("renders section 'Qué ofrecemos'", () => {
    render(<Acerca />);

    expect(
      screen.getByRole("heading", { name: /qué ofrecemos/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/comparación de precios/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/interfaz moderna/i)
    ).toBeInTheDocument();
  });

  it("renders team section", () => {
    render(<Acerca />);

    expect(
      screen.getByRole("heading", { name: /el equipo detrás/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Kerin Aguilar")).toBeInTheDocument();
    expect(screen.getByText("Freddy De Andrade")).toBeInTheDocument();
    expect(screen.getByText("Mohamed Bada")).toBeInTheDocument();
  });

  it("renders team images with alt text", () => {
    render(<Acerca />);

    expect(screen.getByAltText("Kerin Aguilar")).toBeInTheDocument();
    expect(screen.getByAltText("Freddy De Andrade")).toBeInTheDocument();
    expect(screen.getByAltText("Mohamed Bada")).toBeInTheDocument();
  });

  it("renders Contacto component with props", () => {
    render(<Acerca />);

    const contacto = screen.getByTestId("contacto");

    expect(contacto).toBeInTheDocument();
    expect(contacto).toHaveTextContent("equipo.questhub@example.com");
    expect(contacto).toHaveTextContent(
      "https://github.com/A1ebyte/QuestHub"
    );
    expect(contacto).toHaveTextContent("https://www.linkedin.com");
  });
});