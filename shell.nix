let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-23.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    antlr4_12
    nodejs_21
  ];

  shellHook = ''
    npm set prefix ~/.npm-global
	export PATH=$PATH:~/.npm-global/bin
  '';
}
