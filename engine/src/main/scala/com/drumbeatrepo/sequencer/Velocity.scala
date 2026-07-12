package com.drumbeatrepo.sequencer

enum Velocity(val value: Byte):
  case None    extends Velocity(0)
  case Low    extends Velocity(33)
  case Medium extends Velocity(66)
  case Normal extends Velocity(100)
  case Maximum extends Velocity(127)

object Velocity:
  def fromByte(value: Byte): Velocity = value match
    case 0   => Velocity.None
    case 33  => Velocity.Low
    case 66  => Velocity.Medium
    case 100 => Velocity.Normal
    case 127 => Velocity.Maximum

  def fromBoolean(value: Boolean): Velocity = value match
    case false => Velocity.None
    case true  => Velocity.Normal

  def invert(velocity: Velocity): Velocity = velocity match
    case Velocity.None    => Velocity.Normal
    case _                 => Velocity.None