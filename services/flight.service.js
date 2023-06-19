//todas las consultas para traer la info ordenada
import { pool } from "../db.js";

export function validarNumeros(texto) {
  // Expresión regular que solo permite números
  var regex = /^[0-9]+$/;

  // Verificar si el texto cumple con el patrón
  return regex.test(texto);
}

export const getCheckFlight = async (id) => {
  const query = `
    select f.flight_id  from flight f
    where f.flight_id = ?;
        `;
  const params = [id];
  const [rows] = await pool.execute(query, params);
  console.log("rows", id, rows);
  return rows.length > 0 ? true : false;
};

export const getAirplaneByFlight = async (id) => {
  const query = `
          select f.airplane_id from flight f
          where f.flight_id = ?;
          `;
  const params = [id];
  return pool.execute(query, params);
};

export const getTotalAsientosByFlightByAirplaneByType = async (
  flight_id,
  airplane_id,
  seat_type_id
) => {
  const query = `
    select s.seat_id, s.seat_column , s.seat_row, ps.boarding_pass_id, ps.purchase_id, st.name, bp2.seat_id seat_filter from seat s 
    left join (
        select 
            bp.boarding_pass_id, bp.seat_id , s.seat_row, s.seat_column,  bp.purchase_id
        from boarding_pass bp
        left join flight f on f.flight_id = bp.flight_id 
        left join seat s on s.seat_id = bp.seat_id 
        where bp.flight_id = ? and s.seat_id is not null
        order by s.seat_column asc 
    ) ps on ps.seat_id = s.seat_id 
    left join seat_type st on st.seat_type_id = s.seat_type_id 
    left join boarding_pass bp2 on bp2.boarding_pass_id = ps.boarding_pass_id
    where s.airplane_id = ? and st.seat_type_id = ?
    order by s.seat_row asc, s.seat_id asc;
      `;
  const params = [flight_id, airplane_id, seat_type_id];
  return pool.execute(query, params);
};

export const getUsuariosDisponiblesEconomicoPremium = async (id) => {
  const query = `
        select 
            bp.*,
            if( p.age < 18 , 1, 0) is_menor,
            st.name 
        from boarding_pass bp 
        join passenger p on p.passenger_id = bp.passenger_id 
        join seat_type st on st.seat_type_id = bp.seat_type_id 
        where bp.seat_id is null and bp.flight_id = ? and st.seat_type_id = 2
        order by st.seat_type_id asc, bp.purchase_id asc;
    `;
  const params = [id];
  return pool.execute(query, params);
};

export const getUsuariosDisponiblesEconomico = async (id) => {
  const query = `
          select 
              bp.*,
              if( p.age < 18 , 1, 0) is_menor,
              st.name 
          from boarding_pass bp 
          join passenger p on p.passenger_id = bp.passenger_id 
          join seat_type st on st.seat_type_id = bp.seat_type_id 
          where bp.seat_id is null and bp.flight_id = ? and st.seat_type_id = 3
          order by st.seat_type_id asc, bp.purchase_id asc;
      `;
  const params = [id];
  return pool.execute(query, params);
};

export const asientosOcupados = async (id, seat_type_id) => {
  const query = `
    select bp.*,  s.seat_column, s.seat_row, s.seat_type_id  from boarding_pass bp
    join seat s on s.seat_id = bp.seat_id 
    where bp.seat_id is not null and bp.flight_id = ? and s.seat_type_id = ?
    order by s.seat_row asc, s.seat_id asc;
`;
  const params = [id, seat_type_id];
  return pool.execute(query, params);
};
