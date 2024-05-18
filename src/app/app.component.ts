import { CommonModule } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  //variável 
  apiUrl: string = 'http://localhost:8081/api/clientes';
  clientes: any[] = [];



  //Método construtor
  constructor(
    private httpClient: HttpClient
  ) {

  }
  formCadastro = new FormGroup({
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])

  });

  formEdicao = new FormGroup ({
    idCliente: new FormControl(''),
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });

  
  //Função para verificar se os campos do formulário
  //estão com erro de validação a exibir mensagens
  get fCadastro(){
    return this.formCadastro.controls;

  }

  //função para verificar se os campos do formulário de edição
  //estão com erro de validação e exibir mensagem
  get fEdicao(){
    return this.formEdicao.controls;
  }


  //Método executado quando a página abrir
  ngOnInit(): void {

    //Fazendo uma requisição Get para API de consulta de clientes
    this.httpClient.get(this.apiUrl + '/consultar')
      .subscribe({
        next: (data) => {

          this.clientes = data as any[];
          console.log(data);


        }


      })
      
  }

  cadastrarCliente(): void{
    this.httpClient.post(this.apiUrl + '/criar', this.formCadastro.value, 
      {responseType: 'text'}).subscribe({
        
        next:(data) => {
          this.formCadastro.reset();//limpando formulário
          this.ngOnInit();//exibindo a consulta de cadastro
          
          alert(data);
          
                      
        }
        
        
        
          
      })
  }

  //Método executado ao clicar no botão exclusão
  excluirCliente(idCliente: string): void{
    if(confirm('Deseja realmnete excluir o cliente selecionado?')) {
      //enviar para a api excluir clliente
      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, {responseType: 'text'})
        .subscribe({ //Capturando a resposta da this.apiUrl
          next:(data) => { //recebendo a mensagem de sucesso da API
            this.ngOnInit(); //executando a consulta novamente
            alert(data); //exibindo a mensagem
          }


        })

        

    }
  }

  //método para capturar o cliente selecionado na tela
  //e excluir os seus dados no formulário de edição
  obterCliente(c: any): void {
    //preencher os campos do formulário edição
    this.formEdicao.controls['idCliente'].setValue(c.idCliente);
    this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente);
    this.formEdicao.controls['emailCliente'].setValue(c.emailCliente);
    this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente);


  }

  //Obter um método para enviar uma requisição
  //para o ENDPOINT da edição da API
  atualizarCliente(): void{

    this.httpClient.put(this.apiUrl + "/editar", this.formEdicao.value, {responseType: 'text'})
      .subscribe({ //configurando a resposta obtida da API

      next: (data) => { //recebendo a resposta de sucesso

      this.ngOnInit(); //
    alert(data);//mostrando a mensagem na tela
  }
})
    
  }

}

  



  



  



