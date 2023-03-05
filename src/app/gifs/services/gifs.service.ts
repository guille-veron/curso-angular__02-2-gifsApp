import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse,Gif } from '../../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];

  private _api_key:string = '';
  private _servicio_url:string = 'https://api.giphy.com/v1/gifs';

  // TODO: cambiar tipado
  public resultados:Gif[] = [];
  

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimo-resultado')!) || [];
   }

  buscarGifs(valor:string=''){
    valor = valor.trim().toLowerCase();
    if (!this._historial.includes(valor)) {
      this._historial.unshift(valor);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial', JSON.stringify(this._historial));      
    }

    const params = new HttpParams()
      .set('api_key',this._api_key)
      .set('q',valor)
      .set('limit','10')
      .set('lang','es')

    this.http.get<SearchGifsResponse>(`${this._servicio_url}/search`,{params})
        .subscribe(resp => {
          console.log(resp.data);
          this.resultados = resp.data;
          localStorage.setItem('ultimo-resultado',JSON.stringify(this.resultados));
        })  
  }
}
