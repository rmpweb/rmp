export interface Image {
    id: string;
    farm: number;
    isfamily: number;
    isfriend: number;
    ispublic: number;
    owner: string;
    secret: string;
    server: string;
    title: string;
    tags?: string;
    url: string;
    urlb: string;
}