{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShell = with pkgs;
        mkShell {
          buildInputs = [
            nodejs
            nodePackages."@angular/cli"
            pkgs.chromium
          ];
        };

        shellHook = ''
            export CHROME_BIN=${pkgs.chromium}/bin/chromium
            echo "ChromeHeadless ready 🧪"
        '';
    });
}