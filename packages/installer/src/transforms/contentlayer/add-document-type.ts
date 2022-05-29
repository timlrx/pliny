export const x = 6
// import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer/source-files'
// import { Generator } from '@mrleebo/prisma-ast'
// import { produceSchema } from './produce-schema'
// import { Program } from '../../types'
// import type { DocumentTypeDef } from 'contentlayer/source-files'
// import { findModuleExportsExpressions } from '../find-module-exports-expressions'

// export function addDocumentType(program: Program, documentTypeDef: DocumentTypeDef): Program {}

// function updateBabelConfig(program: Program, item: AddBabelItemDefinition, key: string): Program {
//   findModuleExportsExpressions(program).forEach((moduleExportsExpression) => {
//     j(moduleExportsExpression)
//       .find(j.ObjectProperty, { key: { name: key } })
//       .forEach((items) => {
//         // Don't add it again if it already exists,
//         // that what this code does. For simplicity,
//         // all the examples will be with key = 'presets'

//         const itemName = Array.isArray(item) ? item[0] : item

//         if (items.node.value.type === 'Literal' || items.node.value.type === 'StringLiteral') {
//           // {
//           //   presets: "this-preset"
//           // }
//           if (itemName !== items.node.value.value) {
//             items.node.value = j.arrayExpression([items.node.value, jsonValueToExpression(item)])
//           }
//         } else if (items.node.value.type === 'ArrayExpression') {
//           // {
//           //   presets: ["this-preset", "maybe-another", ...]
//           // }
//           // Here, it will return if it find the preset inside the
//           // array, so the last line doesn't push a duplicated preset
//           for (const [i, element] of items.node.value.elements.entries()) {
//             if (!element) continue

//             if (element.type === 'Literal' || element.type === 'StringLiteral') {
//               // {
//               //   presets: [..., "this-preset", ...]
//               // }
//               if (element.value === itemName) return
//             } else if (element.type === 'ArrayExpression') {
//               // {
//               //   presets: [..., ["this-preset"], ...]
//               // }
//               if (
//                 (element.elements[0]?.type === 'Literal' ||
//                   element.elements[0]?.type === 'StringLiteral') &&
//                 element.elements[0].value === itemName
//               ) {
//                 if (
//                   element.elements[1]?.type === 'ObjectExpression' &&
//                   element.elements[1].properties.length > 0
//                 ) {
//                   // The preset has a config.
//                   // ["this-preset", {...}]
//                   if (Array.isArray(item)) {
//                     // If it has an adittional config, add the new keys
//                     // (don't matter if they already exists, let the user handle it later by themself)
//                     let obj = element.elements[1]

//                     for (const key in item[1]) {
//                       const value = item[1][key]
//                       if (value === undefined) continue
//                       obj.properties.push(
//                         j.objectProperty(j.stringLiteral(key), jsonValueToExpression(value))
//                       )
//                     }

//                     items.node.value.elements[i] = obj
//                   }
//                 } else {
//                   // The preset has no config.
//                   // Its ["this-preset"]
//                   items.node.value.elements[i] = jsonValueToExpression(item)
//                 }

//                 return
//               }
//             }
//           }
//           items.node.value.elements.push(jsonValueToExpression(item))
//         }
//       })
//   })

//   return program
// }

// export const addBabelPlugin = (program: Program, plugin: AddBabelItemDefinition): Program =>
//   updateBabelConfig(program, plugin, 'plugins')
// /**
//  * Adds a generator to your schema.prisma data model.
//  *
//  * @param source - schema.prisma source file contents
//  * @param generatorProps - the generator to add
//  * @returns The modified schema.prisma source
//  * @example Usage
//  * ```
//  *  addPrismaGenerator(source, {
//       type: "generator",
//       name: "nexusPrisma",
//       assignments: [{type: "assignment", key: "provider", value: '"nexus-prisma"'}],
//     })
//  * ```
//  */
// export function addPrismaGenerator(source: string, generatorProps: Generator): Promise<string> {
//   return produceSchema(source, (schema) => {
//     const existing = schema.list.find(
//       (x) => x.type === 'generator' && x.name === generatorProps.name
//     ) as Generator
//     existing ? Object.assign(existing, generatorProps) : schema.list.push(generatorProps)
//   })
// }

// /**
//  * A file transformer that parses a schema.prisma string, offers you a callback
//  * of the parsed document object, then takes your changes to the document and
//  * writes out a new schema.prisma string with the changes applied.
//  *
//  * @param source - schema.prisma source file contents
//  * @param producer - a callback function that can mutate the parsed data model
//  * @returns The modified schema.prisma source
//  */
// export async function produceSchema(
//   source: string,
//   producer: (schema: Schema) => void
// ): Promise<string> {
//   const schema = await getSchema(source)
//   producer(schema)
//   return printSchema(schema)
// }
