package com.example.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.external.cheapshark.CheapSharkClient;
import com.example.external.steam.SteamClient;
import com.example.model.VideojuegoSteamDTO;
import com.example.util.SortBy;

@RestController
@RequestMapping("/api")
public class Controller {

    private final SteamClient servicioSteam;
    private final CheapSharkClient servicioCheapShark;
    
    public Controller(SteamClient servicioSteam, CheapSharkClient servicioCheapShark) {
		this.servicioSteam = servicioSteam;
		this.servicioCheapShark = servicioCheapShark;
	}

	@GetMapping("/{id}")
    public VideojuegoSteamDTO getJuego(@PathVariable(name = "id") long id) {
        return servicioSteam.getGame(id);
    }
    
    @GetMapping("/top10") //usamos ? dentro de ResponseEntity para decir que es cualquier cosa
    public ResponseEntity<?> top10Gamedeals(@RequestParam(required = false,defaultValue = "DealRating",name = "type") String type){
    	try {
            SortBy sort = SortBy.valueOf(type);
            return ResponseEntity.ok(servicioCheapShark.top10Deals(sort));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid sortBy value: " + type);
        }    	
    }
    
    @GetMapping("/deals") //usamos ? dentro de ResponseEntity para decir que es cualquier cosa
    public ResponseEntity<?> gamedeals(){
        return ResponseEntity.ok(servicioCheapShark.FetchAllDeals());
    }
    /*
    
    @GetMapping("/generos")
    public String getGeneros() {
        //return rawg.getStores();
    }
    
    @GetMapping("/tiendas/lastUpdate")
    public Map<?, ?> getTiendasUpdate() {
        //return cheapShark.getStoresLastUpdate();
    }
    
    @GetMapping("/tiendas/{id}")
    public TiendaDTO getTienda(@PathVariable(name = "id") long id) {
        //int index=(int)id - 1;
    	//return cheapShark.getStores()[index]!=null?cheapShark.getStores()[index]:null;
    }*/
}