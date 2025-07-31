export const mockProperties = [
    {
        id: 1,
        name: "Departamento céntrico cerca del Tec",
        imgPrincipal: "https://example.com/dept1-principal.jpg",
        imgs: [
            "https://example.com/dept1-sala.jpg",
            "https://example.com/dept1-cocina.jpg",
            "https://example.com/dept1-cuarto.jpg"
        ],
        description: "Hermoso departamento completamente amueblado, ideal para estudiantes. Cuenta con todos los servicios y está muy cerca del campus universitario. Perfecto para compartir entre 2 personas.",
        summary: "Depto amueblado 2 personas, cerca del Tec",
        rateting: 4.5, // Mantuve tu typo para que coincida
        price: 12000,
        isPetFriendly: false,
        capacity: 2,
        isFurnished: true,
        parkingNum: 1,
        contractTime: 12,
        type: "Departamento",
        gender: "Mixto",
        deposit: 6000,
        distance: 0.8,
        bathroom: "Completo",
        isAvailable: true, // Corregido de "avaliable"
        amenities: ["WiFi", "Lavadora", "Cocina equipada", "TV"],
        rules: ["No fumar", "No fiestas después de 10pm", "Mantener limpio"],
        services: ["Agua", "Luz", "Gas", "Internet"]
    },
    {
        id: 2,
        name: "Casa para estudiantes - Solo mujeres",
        imgPrincipal: "https://example.com/casa1-principal.jpg",
        imgs: [
            "https://example.com/casa1-fachada.jpg",
            "https://example.com/casa1-jardin.jpg"
        ],
        description: "Casa segura y cómoda exclusiva para estudiantes mujeres. Ambiente familiar y tranquilo, con todas las comodidades necesarias para el estudio. Incluye servicios básicos.",
        summary: "Casa segura solo mujeres, ambiente familiar",
        rateting: 4.8,
        price: 8500,
        isPetFriendly: true,
        capacity: 4,
        isFurnished: false,
        parkingNum: 0,
        contractTime: 6,
        type: "Casa",
        gender: "Femenino",
        deposit: 4250,
        distance: 1.2,
        bathroom: "Compartido",
        isAvailable: true,
        amenities: ["Jardín", "Cocina", "Sala común", "Estudio"],
        rules: ["Solo mujeres", "No visitas masculinas después de 9pm", "Colaborar con limpieza"],
        services: ["Agua", "Luz", "Internet"]
    },
    {
        id: 3,
        name: "Cuarto individual masculino",
        imgPrincipal: "https://example.com/cuarto1-principal.jpg",
        imgs: ["https://example.com/cuarto1-escritorio.jpg"],
        description: "Habitación individual perfecta para estudiante varón. Incluye escritorio, cama y closet. Baño compartido con solo una persona más. Muy tranquilo para estudiar.",
        summary: "Cuarto individual hombre, muy tranquilo",
        rateting: 4.2,
        price: 5500,
        isPetFriendly: false,
        capacity: 1,
        isFurnished: true,
        parkingNum: 0,
        contractTime: 4,
        type: "Habitación",
        gender: "Masculino",
        deposit: 2750,
        distance: 2.1,
        bathroom: "Compartido",
        isAvailable: false, // Este no está disponible
        amenities: ["Escritorio", "Closet", "Ventilador"],
        rules: ["Solo hombres", "No ruido después de 11pm", "Limpiar después de usar cocina"],
        services: ["Agua", "Luz"]
    }
];