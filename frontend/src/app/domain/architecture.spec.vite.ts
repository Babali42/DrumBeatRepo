import {describe, it} from "vitest";
import {RelativePath} from "arch-unit-ts/dist/arch-unit/core/domain/RelativePath";
import {TypeScriptProject} from "arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject";
import {classes} from "arch-unit-ts/dist/main";

describe("Hexagonal architecture test", () => {
  const srcProject = new TypeScriptProject(RelativePath.of("src"));

  describe("domain", () => {
    it("should not depend on outside", () => {
      classes()
        .that()
        .resideInAPackage("..domain..")
        .should()
        .onlyDependOnClassesThat()
        .resideInAnyPackage("..domain..", "node_modules.effect..")
        .because("domain model should only depend on domain or effect library")
        .check(srcProject.allClasses())
    });
  });
});
