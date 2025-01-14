import pool from "../database/database.js";

export async function actualizarPesoRequisicion (ano, numero) {
    const connection = await pool.getConnection();
    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        // 1. Ejecutar el SELECT para obtener el peso
        const [rows] = await connection.query(
            'SELECT SUM(peso) AS peso FROM requisicion_detalles WHERE ano = ? AND numero = ?',
            [ano, numero]
        );

        // Verificar si se obtuvieron resultados
        if (rows.length === 0) {
            throw new Error('No se encontraron detalles para la requisición');
        }

        const pesoTotal = rows[0].peso || 0;  // Asegurarnos de que no sea null

        // 2. Ejecutar el UPDATE para actualizar el campo `total_peso`
        await connection.query(
            'UPDATE requisiciones SET total_peso = ? WHERE ano = ? AND numero = ?',
            [pesoTotal, ano, numero]
        );

        // Si todo va bien, confirmar la transacción
        await connection.commit();
        console.log('Transacción realizada correctamente');
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await connection.rollback();
        throw new Error('Error en la transacción, revertiendo cambios: ' + error.message);
    } finally {
        // Liberar la conexión
        connection.release();
    }
}

export async function generarentrega (ano, numero, requisicion, fecha, usuario, descripcion) {
    const connection = await pool.getConnection();
    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        //Inicializar variables

        let id_cliente;

        const [rows] = await connection.query(
            'select * from requisiciones where ano = ? and numero = ?',
            [ano, requisicion]
        );

        // Verificar si se obtuvieron resultados
        if (rows.length === 0) {
            throw new Error('No se encontro requisición');
        }

        id_cliente = rows[0].cliente_id;

        await connection.query(
            'insert into entregas values (?,?,?,?,?,0,0,?,\'\',?);',
            [ano, numero, requisicion, id_cliente, fecha, usuario, descripcion]
        );


        const [rowsD] = await connection.query(
            'select * from requisicion_detalles where ano = ? and numero = ? and saldo > 0',
            [ano, requisicion]
        );

        // Verificar si se obtuvieron resultados
        if (rowsD.length === 0) {
            throw new Error('No existen detalles con saldo');
        }

        let consecutivo = 1;
        for (let i = 0; i < rowsD.length; i++) {
            await connection.query(
                'insert into entregas_detalle values (?,?,?,?,?,?,0,0,\'\',?,\'\',?);',
                [ano, numero, consecutivo, rowsD[i].id_producto, rowsD[i].saldo, rowsD[i].peso, usuario, rowsD[i].consecutivo]
            );
            consecutivo++;
        }

        // Si todo va bien, confirmar la transacción
        await connection.commit();
        console.log('Transacción realizada correctamente');
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await connection.rollback();
        throw new Error('Error en la transacción, revertiendo cambios: ' + error.message);
    } finally {
        // Liberar la conexión
        connection.release();
    }
}

export async function actualizarentrega (ano, numero, consecutivo, requisicion, cant_entrega, peso_entrega, observacion, usuario) {
    const connection = await pool.getConnection();
    try {
        // Iniciar la transacción
        await connection.beginTransaction();

        await connection.query(
            'UPDATE entregas_detalle SET cant_entregada = ?, peso_entregado = ?, observacion = ?, usuario_m = ? WHERE ano = ? AND numero = ? AND consecutivo = ?',
            [cant_entrega, peso_entrega, observacion, usuario, ano, numero, consecutivo]
        );

        // 1. Ejecutar el SELECT para obtener el peso
        const [rows] = await connection.query(
            'SELECT SUM(peso_entregado) AS peso_entregado FROM entregas_detalle WHERE ano = ? AND numero = ?',
            [ano, numero]
        );

        // Verificar si se obtuvieron resultados
        if (rows.length === 0) {
            throw new Error('No se encontraron detalles para la entrega');
        }

        const pesoTotal = rows[0].peso_entregado || 0;

        // 2. Ejecutar el UPDATE para actualizar el campo `total_peso`
        await connection.query(
            'UPDATE entregas SET total_peso = ? WHERE ano = ? AND numero = ?',
            [pesoTotal, ano, numero]
        );

        //3. Actualizar el saldo de la requisicion

        const [rowsEnt] = await connection.query(
            'select * from entregas_detalle WHERE ano = ? and numero = ? and consecutivo = ?',
            [ano, numero, consecutivo]
        );

        for (let i = 0; i < rowsEnt.length; i++) {
            const [cantidad_entregado] = await connection.query(
                'select cantidad_recibida from requisicion_detalles WHERE ano = ? and numero = ? and consecutivo = ?',
                [ano, requisicion, rowsEnt[i].consecutivo_afect]
            );

            const [cantidad_req] = await connection.query(
                'SELECT SUM(entregas_detalle.cant_entregada) AS cant_entregada ' +
                'FROM entregas ' +
                'INNER JOIN entregas_detalle ON entregas.ano = entregas_detalle.ano ' +
                'AND entregas.numero = entregas_detalle.numero ' +
                'WHERE entregas.ano = ? ' +
                'AND entregas.requisicion = ? ' +
                'AND consecutivo_afect = ?',
                [ano, requisicion, rowsEnt[i].consecutivo_afect]
            );

            let saldo = cantidad_entregado[0].cantidad_recibida - cantidad_req[0].cant_entregada;

            await connection.query(
                'UPDATE requisicion_detalles set saldo = ? WHERE ano = ? and numero = ? and consecutivo = ?',
                [saldo, ano, requisicion, rowsEnt[i].consecutivo_afect]
            );

        }

        // Si todo va bien, confirmar la transacción
        await connection.commit();
        console.log('Transacción realizada correctamente');
        return true;
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await connection.rollback();
        return false;
    } finally {
        // Liberar la conexión
        connection.release();
    }
}
