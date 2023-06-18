import { getExample } from "../services/flight.service.js"

export const getFlightById = async (req, res) => {
    const [rows,fields]= await getExample(req.params.id)
    //fields tiene las cabeceras de la tabla
    console.log('obteniendo Id del vuelo', req.params.id)
    // console.log('data', data)
    return res.status(200).json({
        status: true,
        message: 'la API funciona',
        data: rows
    })
}

