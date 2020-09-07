import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import * as console from 'console';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O campo nome deve ter pelo menos 3 caracteres! ' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório!' }, //obrigatorio 
      { tipo: 'minlength', mensagem: 'O campo CPF deve ter pelo menos 11 caracteres!' }, //min 11
      { tipo: 'maxlength', mensagem: 'O campo CPF deve ter no máximo 14 caracteres!' }, //max 14
      { tipo: 'invalido', mensagem: 'CPF Inválido!' } //cpf invalido
    ],
    nascimento: [
      { tipo: 'required', mensagem: 'O campo data de nascimento é obrigatório!' } //obrigatorio
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo gênero é obrigatório!' } //obrigatorio
    ],
    celular: [
      { tipo: 'maxlength', mensagem: 'O campo celular deve ter no máximo 16 caracteres!' } //max 16
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!' }, //obrigatorio
      { tipo: 'email', mensagem: 'E-mail inválido!' } //INVÁLIDO
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório!' }, //obrigatório
      { tipo: 'minlength', mensagem: 'O campo senha deve ter no mínimo 6 caracteres!' } //min 6
    ],
    confirmarSenha: [
      { tipo: 'required', mensagem: 'O campo confirmar senha é obrigatório!' }, //obrigatório
      { tipo: 'minlength', mensagem: 'O campo confirmar senha deve ter no mínimo 6 caracteres!' }, //min 6
      { tipo: 'comparacao', mensagem: 'As senhas devem ser iguais!' } //senhas iguais
    ],
  }


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController
  ) {


    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])], //Nome: [obrigatório, minímo(3)]
      cpf: ['', Validators.compose([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(14),
        CpfValidator.cpfValido
      ])],//CPF:[obrigatório, minímo(11), máximo(14)]
      nascimento: ['', Validators.compose([
        Validators.required
      ])], //Data de Nascimento: [obrigatório]  
      genero: ['', Validators.compose([
        Validators.required
      ])], //Genero: [obrigatório]
      celular: ['', Validators.compose([
        Validators.maxLength(16)
      ])], //Celular: [máximo(16)]
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])], //E-mail: [obrigatório]
      senha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])], //Senha: [obrigatório, minímo(6)]
      confirmarSenha: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])], //Confirma Senha: [obrigatório, minímo(6)]
    }, {
      validator: ComparacaoValidator('senha', 'confirmarSenha')
    })
  }

  ngOnInit() {
    this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
  }

  public registro() {
    if (this.formRegistro.valid) {
      console.log('Formulário Válido!');
      this.router.navigateByUrl("/login");
    } else {
      console.log('Formulário inválido.');
    }
  }

  public async salvarFormulario() {
    if (this.formRegistro.valid) {

      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if (await this.usuariosService.salvar(usuario)) {
        this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!');
        this.router.navigateByUrl('/login');
      } else {
        this.exibirAlerta('ERRO!', 'Erro ao salvar o usuário');
      }

    } else {
      this.exibirAlerta('ADVERTÊNCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

  }
}
