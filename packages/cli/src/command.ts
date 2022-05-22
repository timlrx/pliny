import { Command as OclifCommand } from '@oclif/core'
const Enquirer = require('enquirer')

export abstract class Command extends OclifCommand {
  protected enquirer = new Enquirer()
}
