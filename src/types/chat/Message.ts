export interface Chat {
    id: string;
    name: string;
    date: string;
  }
  
export interface Message {
    id: number
    text: string
    sender: string
    time: number
    file?: {
        name: string
        url: string
        type: 'image' | 'document'
    }
}