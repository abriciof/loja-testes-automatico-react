import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemFavorito from "../ItemFavorito";
import { calculaValorComPorcentagemDeDesconto } from "@/app/helpers";
import { mockProdutos } from "@/app/mocks/produtos";
import {
    FavoritosProvider,
    useProdutoFavorito,
  } from "../../../State/FavoritosProvider";


jest.mock("../../../State/FavoritosProvider", () => ({
    ...jest.requireActual("../../../State/FavoritosProvider"),
    useProdutoFavorito: jest.fn(),
}));

describe("ItemFavorito", () => {
    test("deve renderizar corretamente as informações do item favorito", () => {
        const useProdutoFavoritoMock = useProdutoFavorito as jest.Mock;
        useProdutoFavoritoMock.mockReturnValue(true);
        
        const itemFavoritoMockado = mockProdutos[0];
        const { nome, descricao, fotos, desconto, preco } = itemFavoritoMockado;
    
        const precoComDesconto = calculaValorComPorcentagemDeDesconto(
            Number(preco),
            desconto
        );

        render(
            <FavoritosProvider>
                <ItemFavorito itemFavorito={itemFavoritoMockado} setFavoritos={() => {}} />
            </FavoritosProvider>
        );

        expect(screen.getByText(nome)).toBeInTheDocument();
        expect(screen.getByText(descricao)).toBeInTheDocument();
        expect(screen.getByText(`R$ ${precoComDesconto.toFixed(2)}`)).toBeInTheDocument();
        expect(screen.getByText(`${desconto}%`)).toBeInTheDocument();
        expect(screen.getByAltText(fotos[0].titulo)).toBeInTheDocument();
    });

    test("deve ser possível clicar no botão remover, quando item for favorito", async () => {
        const setFavoritos = jest.fn();
        const useProdutoFavoritoMock = useProdutoFavorito as jest.Mock;
        useProdutoFavoritoMock.mockReturnValue(true);

        const itemFavoritoMockado = mockProdutos[0];

        render(
            <FavoritosProvider>
                <ItemFavorito itemFavorito={itemFavoritoMockado} setFavoritos={setFavoritos} />
            </FavoritosProvider>
        );

        const botao = screen.getByRole("button", {
            name: /Remover/i,
        });

        await userEvent.click(botao);

        expect(setFavoritos).toHaveBeenCalledTimes(1);
    });
});
