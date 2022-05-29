import j from 'jscodeshift'
import { Program } from '../../types'

export const findImports = (program: Program) => {
  return program.find(j.ImportDeclaration).paths()
}

export const findMakeSource = (program: Program) => {
  // In contentlayer make source should always be default exported
  return program.find(j.ExportDefaultDeclaration).paths()
}

export const findContentlayerDefineDocument = (program: Program) => {
  const defineDocument = program.find(j.VariableDeclaration).filter((path) => {
    const firstInnerDeclaration = path.value.declarations[0]
    let status = false
    // path.name is a number if it contains an array i.e. a body node
    if (typeof path.name === 'number' && firstInnerDeclaration.type == 'VariableDeclarator') {
      const init = firstInnerDeclaration.init
      if (init.type == 'CallExpression') {
        const callee = init.callee
        if (callee.type == 'Identifier' && callee.name == 'defineDocumentType') {
          status = true
        }
      }
    }
    return status
  })
  const exportedDefineDocument = program.find(j.ExportNamedDeclaration).filter((path) => {
    const declaration = path.value.declaration
    let status = false
    if (declaration.type == 'VariableDeclaration' && declaration.declarations) {
      const firstInnerDeclaration = declaration.declarations[0]
      if (firstInnerDeclaration.type == 'VariableDeclarator') {
        const init = firstInnerDeclaration.init
        if (init.type == 'CallExpression') {
          const callee = init.callee
          if (callee.type == 'Identifier' && callee.name == 'defineDocumentType') {
            status = true
          }
        }
      }
    }
    return status
  })
  const allPaths = [...defineDocument.paths(), ...exportedDefineDocument.paths()]
  return allPaths
}
