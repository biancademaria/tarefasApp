import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

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
    dataNascimento: [
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
    ]
  };

  private usuario: Usuario;
  private manterLogadoTemp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController
  ) {
    this.formAlterar = formBuilder.group({
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
      dataNascimento: ['', Validators.compose([
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
      ])]
    }); //E-mail: [obrigatório]

    this.preencherFormulario();

  }

  ngOnInit() {
  }

  public async preencherFormulario() {
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({ dataNascimento: this.usuario.dataNascimento.toISOString() });
  }

  public async salvar() {
    if (this.formAlterar.valid) {  // serve para ver se o formulário é ou não é válido
       // se for válido, os campos receberão novos dados: um novo nome, nova data, novo gênero e novo celular. o e-mail não pode ser alterado, nem o cpf.
      this.usuario.nome = this.formAlterar.value.nome;
        this.usuario.dataNascimento = new Date(this.formAlterar.value.dataNascimento);
          this.usuario.genero = this.formAlterar.value.genero;
            this.usuario.celular = this.formAlterar.value.celular;
              this.usuario.email = this.formAlterar.value.email;

      //manda o usuário para o método alterar
      if(await this.usuariosService.alterar(this.usuario)) { 
        //devolver a propriedade "manter logado"
        this.usuario.manterLogado = this.manterLogadoTemp;
        //quando for devolver, o usuário terá os dados novos, que foram alterados
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        // avisar que tudo ocorreu com sucesso
        this.exibirAlerta("SUCESSO!", "Usuário alterado com sucesso!");
        //depois de tudo ter funcionado, o usuário será redirecionado
        this.router.navigateByUrl('/configuracoes');

      }
 
    }
    else {
      //se o formulário não for válido, aparecerá a seguinte mensagem:
      this.exibirAlerta('ADVERTÊNCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário');
    }

  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();

  }

}
