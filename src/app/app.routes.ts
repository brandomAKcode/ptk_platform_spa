import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PTKLoginGuard, PTKDealerGuard, PTKAdminGuard } from './ptk.guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { StockDetailComponent } from './stock/stock-detail/stock-detail.component';
import { RotationComponent } from './stock/rotation/rotation.component';
import { SendRotationComponent } from './stock/rotation-send/send-rotation.component';
import { RotationDetailComponent } from './stock/rotation-detail/rotation-detail.component';
// admin components
import { AdminComponent } from './admin/admin.component';
import { DealerComponent } from './admin/dealer/dealer.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [PTKLoginGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [PTKDealerGuard] },
    {
        path: 'stock', component: StockComponent,
        children: [
            {
                path: 'detail',
                component: StockDetailComponent
            },
            {
                path: 'rotation',
                component: RotationComponent
            },
            {
                path: 'rotation/send',
                component: SendRotationComponent
            },
            {
                path: 'rotation/detail/:id',
                component: RotationDetailComponent
            }
        ],
        canActivate: [PTKDealerGuard]
    },
    // admin
    { path: 'admin/dashboard', component: AdminComponent, canActivate: [PTKAdminGuard] },
    { path: 'dealer/list', component: DealerComponent, canActivate: [PTKAdminGuard] }
];
