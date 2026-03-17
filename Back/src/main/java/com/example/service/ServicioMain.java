package com.example.service;
 
//aqui se harian las llamadas a la bbdd y si no se encuentra nada se harian a las ApiService correspondiente
public class ServicioMain {
	
    private final ApiServicioCheapShark cheapShark;
    private final ApiServicioRawg rawg;
    
    public ServicioMain(ApiServicioCheapShark cheapShark,  ApiServicioRawg rawg) {
    	this.cheapShark=cheapShark;
    	this.rawg=rawg;
    }
	
}
