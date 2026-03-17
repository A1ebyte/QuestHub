package com.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.TiendaDTO;
import com.example.service.ApiServicioCheapShark;
import com.example.service.ApiServicioRawg;


@RestController
@RequestMapping("/api/cheapshark")
public class Controller {

    private final ApiServicioCheapShark cheapShark;
    private final ApiServicioRawg rawg;


    public Controller(ApiServicioCheapShark cheapShark, ApiServicioRawg rawg) {
        this.cheapShark = cheapShark;
        this.rawg = rawg;
    }

    @GetMapping("/tiendas")
    public TiendaDTO[] getTiendas() {
        return cheapShark.getStores();
    }
    
    @GetMapping("/generos")
    public String getGeneros() {
        return rawg.getStores();
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