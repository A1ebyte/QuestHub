import { View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 12,
    overflow: "hidden",
  },

  image: {
    width: 150,
    height: "100%",
    objectFit: "cover",
    borderRightWidth: 1,
    borderRightColor: "#2a2a2a",
    borderRadius: 10,
  },

  infoWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between", // fecha a la derecha
  },

  info: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },

  genre: {
    fontSize: 10,
    color: "#bbbbbb",
    marginTop: 4,
  },

  platforms: {
    fontSize: 10,
    color: "#999999",
    marginTop: 2,
  },

  date: {
    fontSize: 10,
    color: "#888888",
    marginTop: 10,
    marginRight: 8,
  },
});

export default function GameTarjetaPDF({ game }) {
 return (
  <Link src={`http://localhost:5173/juego/${game.id}`} style={{ textDecoration: "none" }}>
    <View style={styles.card} wrap={false}>
      {//funciona tambien pero da error por el tema de buffer y que esto no le gusta rutas locales
      /* <Image src={game.image} style={styles.image} />*/}

      <Image src={`${window.location.origin}${game.image}`} style={styles.image} />

      <View style={styles.infoWrapper}>
        <View style={styles.info}>
          <Text style={styles.title}>{game.nombre}</Text>
          <Text style={styles.genre}>{game.generos?.join(', ') || 'Sin géneros'}</Text>
          <Text style={styles.platforms}>{game.platforms.join(" · ")}</Text>
        </View>

        <Text style={styles.date}>Agregado el: {game.agregadoEn}</Text>
        
      </View>
    </View>
  </Link>
  );
}