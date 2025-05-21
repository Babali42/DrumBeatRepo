import {TypeScriptProject} from "arch-unit-ts/dist/arch-unit/core/domain/TypeScriptProject";
import {RelativePath} from "arch-unit-ts/dist/arch-unit/core/domain/RelativePath";
import {classes} from "arch-unit-ts/dist/main";

describe('Hexagonal architecture test', () => {
  const srcProject = new TypeScriptProject(RelativePath.of("src"));

  describe("domain", () => {
    it("should not depends on outside", ()=> {
      classes()
        .that()
        .resideInAPackage('..domain..')
        .should()
        .onlyDependOnClassesThat()
        .resideInAPackage('..domain..')
        .because('domain model should only depends on domain')
        .check(srcProject.allClasses())
    })
  })
});
