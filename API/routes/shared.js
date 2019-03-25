/**
 *
 * @param {String} res
 * @param {tmpObj} fields
 */
const handleNoFields = (res, fields) => {
  let output = "Here is a list of acceptable fields. You must specify one or more to indicate what data you're interested in:\n\n"

  for (let field in fields) {
    output += `- ${field} = ${fields[field]}\n`
  }

  output += '\nPass the fields in through the body of your request as an array like so:\n\n'
  output += `{ fields: [ 'fieldNameA', 'fieldNameB' ] }`

  return res.send(output)
}

module.exports.noFields = handleNoFields
