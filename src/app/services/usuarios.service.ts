
import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos() {
    this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');

    if(!this.listaUsuarios) {
      this.listaUsuarios = [];
    }
  } //Fim do método de buscar todos

  public async salvar(usuario: Usuario) {
    await this.buscarTodos();

    if(!usuario) {
      return false;
    }

    if(!this.listaUsuarios) {
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario);
    return  await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
  }

  public async login(email: string, senha: string) {
    let usuario: Usuario;

    await this.buscarTodos();

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado => {
      return (usuarioArmazenado.email === email && usuarioArmazenado.senha === senha);
    }); // retorna um Array;

    if (listaTemporaria.length > 0) {
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario) {
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado() {
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }

  public async removerUsuarioLogado() {
    return await this.armazenamentoService.removerDados('usuarioLogado');
  }

  public async alterar(usuario: Usuario) { //método de alterar usuário que recebe um certo usuário e vai trabalhar as mudanças desse que foi passado para ele
    if(!usuario) { //primeiro ele precisa ter certeza de que o usuário é válido;
      //se o usuário não for válido:
      return false; //não será possível alterar as informações.

    }

    await this.buscarTodos(); //aguardar a atualização da lista de usuários (porque ela foi alterada)

    //buscar a posição desse usuário dentro do armazenamento no array.
    //procura dentro da lista de usuários se existe alguém lá cujo e-mail seja igual ao que foi alterado.
    const index = this.listaUsuarios.findIndex(usuarioArmazenado => {
      return usuarioArmazenado.email == usuario.email;
    });

    // para não perder os dados de senha
    const usuarioTemporario = this.listaUsuarios[index] as Usuario;

    // recuperando a senha que já estava armazenando e colocando nesse usuário que foi alterado.
    usuario.senha = usuarioTemporario.senha;

    //colocar esse usuário, que já está alterado, de volta à lista de usuários
    this.listaUsuarios[index] = usuario;

    //o return devolve para o método o resultado de todas essas alterações.
    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);

  } 
}