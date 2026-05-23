// authSync.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http-axios', () => {
  return {
    default: {
      post: vi.fn(),
    },
    backCaido: false,
  };
});

import http from '../http-axios';
import { sincronizarConBackend } from '../authSync';

describe('sincronizarConBackend', () => {
  const usuarioMock = {
    uuid: '123',
    email: 'test@test.com',
    token: 'token-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar al endpoint correctamente', async () => {
    vi.mocked(http.post).mockResolvedValueOnce({} as any);

    await sincronizarConBackend(usuarioMock as any);

    expect(http.post).toHaveBeenCalledTimes(1);

    expect(http.post).toHaveBeenCalledWith(
      '/usuarios/sincronizar',
      {
        id: usuarioMock.uuid,
        email: usuarioMock.email,
      },
      {
        headers: {
          Authorization: `Bearer ${usuarioMock.token}`,
        },
      },
    );
  });

  it('debe ignorar errores del backend', async () => {
    vi.mocked(http.post).mockRejectedValueOnce(
      new Error('Error backend'),
    );

    await expect(
      sincronizarConBackend(usuarioMock as any),
    ).resolves.toBeUndefined();

    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('no debe llamar al backend si backCaido es true', async () => {
    vi.resetModules();

    vi.doMock('../http-axios', () => ({
      default: {
        post: vi.fn(),
      },
      backCaido: true,
    }));

    const { sincronizarConBackend } = await import('../authSync');
    const mockedHttp = (await import('../http-axios')).default;

    await sincronizarConBackend(usuarioMock as any);

    expect(mockedHttp.post).not.toHaveBeenCalled();
  });
});