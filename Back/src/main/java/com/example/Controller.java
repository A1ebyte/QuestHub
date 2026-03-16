package com.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.TiendaDTO;
import com.example.service.ServicioCheapShark;


@RestController
@RequestMapping("/api/cheapshark")
public class Controller {

    private final ServicioCheapShark cheapShark;

    public Controller(ServicioCheapShark cheapShark) {
        this.cheapShark = cheapShark;
    }

    @GetMapping("/tiendas")
    public TiendaDTO[] getTiendas() {
        return cheapShark.getStores();
    }
    
    @GetMapping("/tiendas/lastUpdate")
    public Map<?, ?> getTiendasUpdate() {
        return cheapShark.getStoresLastUpdate();
    }
    
    @GetMapping("/tiendas/{id}")
    public TiendaDTO getTienda(@PathVariable(name = "id") long id) {
        int index=(int)id - 1;
    	return cheapShark.getStores()[index]!=null?cheapShark.getStores()[index]:null;
    }
}