import {
  asientosOcupados,
  getAirplaneByFlight,
  getCheckFlight,
  getTotalAsientosByFlightByAirplaneByType,
  getUsuariosDisponiblesEconomico,
  getUsuariosDisponiblesEconomicoPremium,
  validarNumeros,
} from "../services/flight.service.js";

export const getFlightById = async (req, res) => {
  const flight_id = req.params.id;

  // Valido el id del vuelo
  if (!validarNumeros(req.params.id)) {
    return res.status(404).json({
      code: 404,
      data: {},
      // message: 'El id del vuelo debe ser un numero'
    });
  }

  if (!(await getCheckFlight(flight_id))) {
    return res.status(404).json({
      code: 404,
      data: {},
    });
  }

  // Busqueda del avion
  const [rowAirplane] = await getAirplaneByFlight(flight_id);

  const airplane_id =
    rowAirplane.length > 0 ? rowAirplane[0].airplane_id : null;

  // Total de asientos Economica premium
  let [rowsTotalEP, fields] = await getTotalAsientosByFlightByAirplaneByType(
    flight_id,
    airplane_id,
    2
  );

  for (let index = 0; index < rowsTotalEP.length; index++) {
    rowsTotalEP[index].idIndex = index;
  }

  //   // Pasajeros sin asignar en clase economica premium
  let [rowsEconomicoPremium] = await getUsuariosDisponiblesEconomicoPremium(
    flight_id
  );

  // Asientos ocupados
  //   let [rowsOcupadosEP] = await asientosOcupados(flight_id, 2);
  let rowsOcupadosEP = rowsTotalEP.filter((it) => it.boarding_pass_id);

  // Simulacion

  for (let index = 0; index < rowsTotalEP.length; index++) {
    rowsTotalEP[index].idIndex = index;
  }

  // Filtros para economicos premium
  for (let indexJ = 0; indexJ < rowsOcupadosEP.length; indexJ++) {
    const elementOcupadoEP = rowsOcupadosEP[indexJ];
    for (let indexY = 0; indexY < rowsEconomicoPremium.length; indexY++) {
      const elementDisponible = rowsEconomicoPremium[indexY];
      //   console.log('sd', elementDisponible.purchase_id);
      //   console.log(
      //     "pu",
      //     elementOcupadoEP.purchase_id, elementDisponible.purchase_id
      //   );
      if (elementOcupadoEP.purchase_id == elementDisponible.purchase_id) {
        rowsEconomicoPremium[indexY].encontro = true;
        // console.log("encontroe");
      }
    }
  }

  for (let indexY = 0; indexY < rowsOcupadosEP.length; indexY++) {
    const elementDisponible = rowsOcupadosEP[indexY];
    for (let index = 0; index < rowsTotalEP.length; index++) {
      const elementTotalEP = rowsTotalEP[index];
      if (elementTotalEP.seat_id == elementDisponible.seat_id) {
        const passengers = rowsEconomicoPremium.filter(
          (it) => it.purchase_id == elementDisponible.purchase_id && it.encontro
        );
        let id = elementTotalEP.idIndex;
        id++;
        passengers.forEach((it) => {
          rowsTotalEP[id].boarding_pass_id = it.boarding_pass_id;
          rowsTotalEP[id].purchase_id = it.purchase_id;
          id++;
          //   it.boarding_pass_id =12222;
          it.seat_id = rowsTotalEP[id].seat_id;
          // console.log('seat', elementTotalEP.seat_id);
        });
      }
    }
  }

  rowsEconomicoPremium = rowsEconomicoPremium.filter((it) => !it.seat_id);

  for (let indexY = 0; indexY < rowsTotalEP.length; indexY++) {
    const elementTotalEP = rowsTotalEP[indexY];
    if (!elementTotalEP.boarding_pass_id) {
      if (rowsEconomicoPremium[0]) {
        rowsTotalEP[indexY].boarding_pass_id =
          rowsEconomicoPremium[0].boarding_pass_id;
        rowsTotalEP[indexY].purchase_id = rowsEconomicoPremium[0].purchase_id;

        rowsEconomicoPremium.shift();
      }
    }
  }

  // Filtros para economicos

  // Total de asientos Economica premium
  let [rowsTotalE, fieldsE] = await getTotalAsientosByFlightByAirplaneByType(
    flight_id,
    airplane_id,
    3
  );

  for (let index = 0; index < rowsTotalE.length; index++) {
    rowsTotalE[index].idIndex = index;
  }

  // Pasajeros sin asignar en clase economica
  let [rowsEconomico] = await getUsuariosDisponiblesEconomico(flight_id);

  //   let [rowsOcupadosEP] = await asientosOcupados(flight_id, 2);
  let rowsOcupadosE = rowsTotalEP.filter((it) => it.boarding_pass_id);

  return res.status(200).json({
    status: true,
    message: "la API funciona",
    data: {
      rowsTotalEP,
      //   rowsEconomicoPremium: rowsEconomicoPremium.filter((it) => it.encontro),
      //   rowsEconomico,
      //   rowsEconomicoPremium: rowsEconomicoPremium.filter((it) => !it.seat_id),
      rowsOcupadosEP,
      rowsTotalE,
    },
  });
};
