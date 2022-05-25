import { Command as OclifCommand } from '@oclif/core'
import Enquirer from 'enquirer'

export abstract class Command extends OclifCommand {
  protected enquirer = new Enquirer()
}
