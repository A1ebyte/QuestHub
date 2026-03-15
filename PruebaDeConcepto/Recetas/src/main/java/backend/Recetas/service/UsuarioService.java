package backend.Recetas.service;

import backend.Recetas.model.Usuario;
import backend.Recetas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registar (Usuario usuario) {
        String passwordCifrado = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordCifrado);

        return usuarioRepository.save(usuario);
    }
}
