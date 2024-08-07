import pool from '../db/dbConfig'
const promise = require('bluebird')

const options = {
  // Initialization Options

  query: function (e: any) {
    // console.clear();
    console.log(e.query)
    // logsUtility.writeConsoleLog(e.query);
    // if (e.params) {
    //     logsUtility.writeConsoleLog('PARAMS: ' + e.params);
    // }
  },

  promiseLib: promise,
  capSQL: true, // if you want all generated SQL capitalized
}
let dbConnection: any
export const pgp = require('pg-promise')(options)
export class dbUtilityClass {
  // Function to execute a query
  query = async (query: string, params?: any[]) => {
    if (!dbConnection) {
      dbConnection = await pool.connect()
    }
    try {
      const res = await dbConnection.query(query, params)
      return res
    } catch (err) {
      throw err
    }
  }

  public insertSQL(row: any, configSQL: any): any {
    let columnSet

    if (row[0]) {
      row.map((o: any, i: string | number) => {
        delete row[i].id
        // row[i].created_by = configSQL.userid;
        // row[i].updated_by = configSQL.userid;
        row[i].created_date = pgp.as.date(new Date())
        row[i].updated_date = pgp.as.date(new Date())
      })
      columnSet = Object.keys(row[0])
    } else {
      delete row.id

      // row.created_by = configSQL.userid;
      // row.updated_by = configSQL.userid;
      row.created_date = pgp.as.date(new Date())
      row.updated_date = pgp.as.date(new Date())
      columnSet = Object.keys(row)
    }
    row =
      pgp.helpers.insert(row, columnSet, { table: configSQL.table }) +
      ' RETURNING id'

    return row
  }

  public updateSQL(row: any, configSQL: any): any {
    let columnSet
    if (row[0]) {
      row.map((o: { updated_by: number; updated_date: Date }, i: any) => {
        // o.updated_by = parseInt(configSQL.userid);
        o.updated_date = new Date() //pgp.as.date(new Date())
      })

      columnSet = Object.keys(row[0])
      row =
        pgp.helpers.update(row, columnSet, {
          schema: configSQL.schema,
          table: configSQL.table,
        }) +
        ` WHERE v.id = t.id` +
        ' RETURNING t.id'
    } else {
      const colId = row.id.toString()
      delete row.id
      // row.updated_by = configSQL.userid;
      row.updated_date = pgp.as.date(new Date())
      columnSet = Object.keys(row)
      row =
        pgp.helpers.update(row, columnSet, {
          schema: configSQL.schema,
          table: configSQL.table,
        }) + pgp.as.format(' WHERE id = $1 RETURNING id', [colId])
    }

    return row
  }

  public upsertSQL(row: any, configSQL: any): any {
    delete row.id

    // row.created_by = configSQL.userid;
    // row.updated_by = configSQL.userid;
    row.created_date = pgp.as.date(new Date())
    row.updated_date = pgp.as.date(new Date())
    // row.status = true;

    let columnSet = Object.keys(row)

    let onConflict = ''

    if (configSQL.uniqueKey) {
      const cs = new pgp.helpers.ColumnSet(columnSet, {
        table: configSQL.table,
      })

      onConflict =
        ` ON CONFLICT(${configSQL.uniqueKey}) DO UPDATE SET ` +
        cs.assignColumns({ from: 'EXCLUDED', skip: ['created_date'] })
    }

    row =
      pgp.helpers.insert(row, columnSet, {
        schema: configSQL.schema,
        table: configSQL.table,
      }) +
      onConflict +
      ' RETURNING id'

    return row
  }

  public updateSQLMultipleKey(row: any, configSQL: any, key?: any): any {
    let columnSet
    key = key ? key : 'id'
    key = typeof key == 'string' ? [key] : key
    if (row[0]) {
      row.map((o: any, i: any) => {
        // o.updated_by = parseInt(configSQL.userid);
        o.updated_date = pgp.as.date(new Date())
      })
      columnSet = Object.keys(row[0])
      const whereCLause = key
        .map((ele: any, i: any) => {
          return `v.${ele}=t.${ele}`
        })
        .join(' AND ')
      row =
        pgp.helpers.update(row, columnSet, {
          schema: configSQL.schema,
          table: configSQL.table,
        }) + `WHERE ${whereCLause} RETURNING t.id`
    } else {
      const whereCLause = key
        .map((ele: any, i: any) => {
          const column = pgp.as.name(ele)
          const value = pgp.as.value(row[ele])
          return `${column}=${value}`
        })
        .join(' AND ')
      // row.updated_by = configSQL.userid;
      row.updated_date = pgp.as.date(new Date())
      columnSet = Object.keys(row)
      row =
        pgp.helpers.update(row, columnSet, {
          schema: configSQL.schema,
          table: configSQL.table,
        }) + `where ${whereCLause} RETURNING id`
    }

    return row
  }
  public deleteRow(row: any, configSql: any) {
    let colId = row.id.toString()

    return `DELETE FROM  ${configSql.table} where id = '${colId}'`
  }
  public deleteRowCustom(row: any, configSql: any, key: any) {
    return `DELETE FROM  ${configSql.table} where ${key} = ${row[key]}`
  }
}

export const dbUtility = new dbUtilityClass()
