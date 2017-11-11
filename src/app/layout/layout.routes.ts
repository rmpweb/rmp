import {Routes} from '@angular/router';
import { GalleryComponent } from '../gallery/components/gallery/gallery.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';

export const LayoutRoutes: Routes = [
    { path: 'overview', component: GalleryComponent},
    { path: 'places', component: GalleryComponent},
    { path: 'about', component: AboutComponent},
    { path: 'contact', component: ContactComponent}
];