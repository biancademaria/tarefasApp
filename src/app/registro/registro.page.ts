import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
      { tipo: 'minlength', mensagem: 'O campo nome deve ter pelo menos 3 caracteres! '}
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório!' }, //obrigatorio 
      { tipo: 'minlength', mensagem: 'O campo CPF deve ter pelo menos 11 caracteres!' }, //min 11
      { tipo: 'maxlength', mensagem: 'O campo CPF deve ter no máximo 14 caracteres!' } //max 14
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
      { tipo: 'minlength', mensagem: 'O campo confirmar senha deve ter no mínimo 6 caracteres!' } //min 6
    ],
  }


  constructor(private formBuilder: FormBuilder, private router: Router) { 
    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])], //Nome: [obrigatório, minímo(3)]
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14)])],//CPF:[obrigatório, minímo(11), máximo(14)]
      nascimento: ['', Validators.compose([Validators.required])], //Data de Nascimento: [obrigatório]  
      genero: ['', Validators.compose([Validators.required])], //Genero: [obrigatório]
      celular: ['', Validators.compose([Validators.maxLength(16)])], //Celular: [máximo(16)]
      email: ['', Validators.compose([Validators.required, Validators.email])], //E-mail: [obrigatório]
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])], //Senha: [obrigatório, minímo(6)]
      confirmarSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])], //Confirma Senha: [obrigatório, minímo(6)]
    })
  }

  ngOnInit() {
  }

  public registro() {
    if(this.formRegistro.valid){
      console.log('Formulário Válido!');
      this.router.navigateByUrl("/login");
    }else {
      console.log('Formulário inválido.');
    }
  }

}
