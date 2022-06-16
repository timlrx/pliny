import type { ExpressionKind } from 'ast-types/gen/kinds'
import j from 'jscodeshift'
import { JsonValue, Program } from '../../types'
import { findContentlayerParts } from './find-contentlayer-parts'

const jsonValueToExpression = (value: JsonValue): ExpressionKind =>
  typeof value === 'string'
    ? j.stringLiteral(value)
    : typeof value === 'number'
    ? j.numericLiteral(value)
    : typeof value === 'boolean'
    ? j.booleanLiteral(value)
    : value === null
    ? j.nullLiteral()
    : Array.isArray(value)
    ? j.arrayExpression(value.map(jsonValueToExpression))
    : j.objectExpression(
        Object.entries(value)
          .filter((entry): entry is [string, JsonValue] => entry[1] !== undefined)
          .map(([key, value]) =>
            j.objectProperty(j.stringLiteral(key), jsonValueToExpression(value))
          )
      )

export function addDocumentType(
  program: Program,
  variableName: string,
  documentTypeDef: JsonValue
): Program {
  const { imports, defineDocument, makeSource } = findContentlayerParts(program)

  const ast = j.variableDeclaration('const', [
    j.variableDeclarator(
      j.identifier(variableName),
      j.callExpression(j.identifier('defineDocumentType'), [
        j.arrowFunctionExpression(
          [],
          //@ts-ignore documentTypeDef will be an object
          j.objectExpression(jsonValueToExpression(documentTypeDef).properties)
        ),
      ])
    ),
  ])

  // Insert after other defineDocument declarations.
  // If none, insert it after imports
  if (imports.length && defineDocument.length) {
    defineDocument[defineDocument.length - 1].insertAfter(ast)
  } else if (imports.length) {
    imports[imports.length - 1].insertAfter(ast)
  } else {
    throw new Error('Expect contentlayer config file to have imports')
  }

  // export default makeSource({
  //   contentDirPath: 'data',
  //   documentTypes: [Blog, Authors],
  // })

  // Add variableName to documentTypes array in makeSource
  const documentTypesField = j(makeSource).find(j.Identifier, { name: 'documentTypes' })

  if (documentTypesField.length) {
    documentTypesField.forEach((p) => {
      const arr = p.parentPath.value.value
      arr.elements.push(variableName)
    })
  } else {
    throw new Error('Expect contentlayer makeSource to have documentType field with an array')
  }

  return program
}
