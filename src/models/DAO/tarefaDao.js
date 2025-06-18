const {createConnection} = require('./db');

async function getTarefas(){
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM tarefa ORDER BY id");
    return rows;
};

async function insertTarefa(titulo, descricao, data_vencimento, status) {
    const connection = await createConnection();
    if (titulo && descricao && data_vencimento && status) {
        const [result] = await connection.query(`
          INSERT INTO tarefa (
            titulo, descricao, data_vencimento, status
          ) VALUES (?, ?, ?, ?)`, 
            [titulo, descricao, data_vencimento, status]);
  
        console.log("Resultado do Insert: ", result);

        if(result.affectedRows > 0) return true;
        console.error("Falha ao inserir tarefa. Faltou algum dado!");
    }
}

async function editTarefa(id, titulo, descricao, data_vencimento, status){
    const connection = await createConnection();
    if(!id || !titulo || !descricao || !data_vencimento || !status){
        console.error("Falha ao editar tarefa, faltou algum dado.");
        return false;
    }

    const [result] = await connection.query(`
        UPDATE tarefa
        SET titulo = ?,
            descricao = ?,
            data_vencimento = ?,
            status = ?
        WHERE id = ?`, [titulo, descricao, data_vencimento, status, id]);

    if(result.affectedRows === 0) return false;
    return true;
}

async function deleteTarefa(id){
    const connection = await createConnection();
    if(id){
        const [result] = await connection.query(`
            DELETE FROM tarefa
            WHERE id = ?`,
            [id]
        );

        if(result.affectedRows === 0) return false;
        return true;
    }
    console.error("Falha ao remover a tarefa!");
    return false;
}

module.exports = {getTarefas, insertTarefa, editTarefa, deleteTarefa};