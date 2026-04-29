package com.example.validation;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import com.example.domain.model.VistaOferta;
import com.example.util.Enums.OfferTier;
import com.example.util.Enums.Reviews;
import com.example.util.TypeRefs;

import jakarta.persistence.criteria.Predicate;

public class VistaOfertaFiltros {

    public static Specification<VistaOferta> titulo(String titulo) {
        return (root, query, cb) ->
                titulo == null ? null :
                cb.like(cb.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%");
    }

    public static Specification<VistaOferta> minPrecio(Double minPrecio) {
        return (root, query, cb) ->
                minPrecio == null ? null :
                cb.greaterThanOrEqualTo(root.get("precioOferta"), minPrecio);
    }

    public static Specification<VistaOferta> maxPrecio(Double maxPrecio) {
        return (root, query, cb) ->
                maxPrecio == null ? null :
                cb.lessThanOrEqualTo(root.get("precioOferta"), maxPrecio);
    }

    public static Specification<VistaOferta> ahorroDesde(Double minAhorro) {
        return (root, query, cb) ->
                minAhorro == null ? null :
                cb.greaterThanOrEqualTo(root.get("ahorro"), minAhorro);
    }

    public static Specification<VistaOferta> tiers(List<OfferTier> tiers) {
        return (root, query, cb) -> {
            if (tiers == null || tiers.isEmpty()) return null;

            List<Predicate> preds = new ArrayList<>();

            for (OfferTier tier : tiers) {
                preds.add(
                    switch (tier) {
                        case MYTHIC -> cb.greaterThanOrEqualTo(root.get("ofertaRating"), TypeRefs.TIERS.get(OfferTier.MYTHIC).min());
                        case EPIC -> cb.between(root.get("ofertaRating"), TypeRefs.TIERS.get(OfferTier.EPIC).min(), TypeRefs.TIERS.get(OfferTier.EPIC).max());
                        case RARE -> cb.between(root.get("ofertaRating"), TypeRefs.TIERS.get(OfferTier.RARE).min(), TypeRefs.TIERS.get(OfferTier.RARE).max());
                        case STANDARD -> cb.between(root.get("ofertaRating"), TypeRefs.TIERS.get(OfferTier.STANDARD).min(), TypeRefs.TIERS.get(OfferTier.STANDARD).max());
                        case BASIC -> cb.lessThan(root.get("ofertaRating"), TypeRefs.TIERS.get(OfferTier.BASIC).max());
                    }
                );
            }

            return cb.or(preds.toArray(new Predicate[0]));
        };
    }

    public static Specification<VistaOferta> minReviews(List<Reviews> reviews) {
    	return (root, query, cb) -> {
            if (reviews == null || reviews.isEmpty()) return null;
            
            List<Predicate> preds = new ArrayList<>();

            for (Reviews tier : reviews) {
                preds.add(
                    switch (tier) {
                        case NO_REVIEWS -> cb.equal(root.get("reviews"), 0);
                        case EXTREMADAMENTENEGATIVAS -> cb.between(root.get("reviews"), 1, 20);
                        case NEGATIVAS -> cb.between(root.get("reviews"), 20, 40);
                        case VARIADAS -> cb.between(root.get("reviews"), 40, 70);
                        case POSITIVAS -> cb.between(root.get("reviews"), 70, 80);
                        case EXTREMADAMENTEPOSITIVAS -> cb.greaterThan(root.get("reviews"),80);
                    }
                );
            }

            return cb.or(preds.toArray(new Predicate[0]));
        };
    }

    public static Specification<VistaOferta> inicioOferta(LocalDateTime inicio) {
        return (root, query, cb) ->
                inicio == null ? null :
                cb.greaterThanOrEqualTo(root.get("recent"), inicio);
    }
    
    public static Specification<VistaOferta> tiendaIds(List<Long> tiendaIds) {
        return (root, query, cb) -> {
            if (tiendaIds == null || tiendaIds.isEmpty()) return null;

            List<Predicate> preds = new ArrayList<>();

            for (Long id : tiendaIds) {
                preds.add(
                    cb.like(root.get("tiendaIds"), "%," + id + ",%")
                );
            }

            return cb.or(preds.toArray(new Predicate[0]));
        };
    }

}

