// Error404.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Error404 from './Error404';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>(
    'react-router-dom',
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Error404', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el título 404', () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('404 – Quest Failed'),
    ).toBeInTheDocument();
  });

  it('debe renderizar una frase aleatoria', () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>,
    );

    const frase = screen.getByText((content) =>
      [
        'Has entrado en el vacío.',
        'Camino sin desbloquear.',
        'Aquí termina el mapa.',
        'Has muerto… espiritualmente.',
        "Los NPC's no conocen este lugar.",
        'Checkpoint no encontrado.',
        'Esta zona no existe.',
        'Te saliste del mapa.',
        'Nada más allá de este punto.',
        'Has sido derrotado por error-404.',
        'Te hace falta un objeto.',
        'El tiempo ha terminado.',
      ].includes(content),
    );

    expect(frase).toBeInTheDocument();
  });

  it('debe renderizar el gif de error', () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>,
    );

    const imagen = screen.getByAltText('Error 404');

    expect(imagen).toBeInTheDocument();

    expect(imagen).toHaveAttribute('src');

    expect(
      (imagen as HTMLImageElement).src,
    ).toContain('http');
  });

  it('debe navegar hacia atrás al pulsar el botón volver', () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>,
    );

    const boton = screen.getByRole('button', {
      name: /volver atrás/i,
    });

    fireEvent.click(boton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('debe renderizar el link al inicio', () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {
      name: /ir al inicio/i,
    });

    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute('href', '/');
  });
});