import {Request, Response} from "express";
import {PropiedadRentaDB} from "../models/rentalProperty.schema.ts"
import {ArrendadorDB} from "../../arrendador/models/arrendador.schema.ts"


static async aceptarSolicitud(req: Request, res: Response){
/*
 * Función para que, como arrendador, se pueda aceptar una solicitud de residencia
 * */
}

static async rechazarSolicitud(req: Request, res: Response){
/*
 *Función para que, como arrendador, pueda rechazar una solicitud de residencia y
 enviar una explicación*/
}

static async enviarOferta(req: Request, res: Response){
/*
 * Función para que, como arrendador o Estudiante, pueda enviar una oferta o contraoferta
 * Pd: Sólo pueden realizar un mázimo de 2 contraofertas por ID
 * */
}

static async aceptarOferta(req: Request, res: Response){

/*
 *Función para que, como arrendador o estudiante, pueda aceptar una oferta o
 contraoferta*/}

 static async rechazarOferta(req: Request, res: Response){
 /*
  * Función para que, como arrendador o estudiante, pueda rechazar una oferta o 
  * contraoferta*/
 }
