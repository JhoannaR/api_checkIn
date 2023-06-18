//todas las consultas para traer la info ordenada
import { pool } from '../db.js'
export const getExample = async (id) => {
    const query = `
        select 
            bp.passenger_id passengerId,
            p.dni,
            p.name,
            p.age,
            p.country,
            bp.boarding_pass_id boardingPassId,
            bp.purchase_id purchaseId,
            bp.seat_type_id seatTypeId,
            bp.seat_id seatId, 
            s.seat_column,
            s.seat_row,
            st.name
        from boarding_pass bp
        left join flight f on f.flight_id  = bp.flight_id
        left join passenger p on p.passenger_id = bp.passenger_id 
        left join seat s on s.seat_id = bp.seat_id 
        left join seat_type st on st.seat_type_id = s.seat_type_id 
        where bp.flight_id = ?;
    `;
    const params = [id];
    return pool.execute(query, params)
}