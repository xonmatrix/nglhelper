import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpDialogComponent } from './popupdialog.component';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseJSON } from '../common/parseJSON';

declare let iziToast: any;

@Injectable({
  providedIn: 'root',
})
export class DialogHelper {
  static GetFriendlyError(err: any) {
    if (err instanceof Error) return err.message;

    if (err instanceof HttpErrorResponse) {
      if (err.error instanceof Error)
        return 'Network Error. Please Check internet connection.';

      switch (err.status) {
        case 400:
          const contentType = err.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') >= 0) {
            try {
              const errJson = parseJSON(err.error);
              if (typeof errJson === 'string') {
                return errJson;
              } else if (errJson.message) {
                return errJson.message;
              }
            } catch (err2) {
              return 'Invalid error json format.';
            }
          }
          return err.error;
        case 500:
          return 'Server error';
        case 401:
          return 'Unauthorized. Please re-login and try again.';
        case 404:
          return 'Resource not found.';
        case 0:
          return 'Connection Error. Please check you network connection and try again';
        default:
          return err.statusText;
      }
    }
    return err;
  }

  constructor(private dialog: MatDialog, private zone: NgZone) {}

  ShowMessageDialog(options: IDialogOptions): Observable<boolean> {
    return this.dialog
      .open(PopUpDialogComponent, {
        disableClose: true,
        data: options,
      })
      .afterClosed();
  }

  Alert(message: string, title: string = 'Alert'): Observable<boolean> {
    return this.ShowMessageDialog({
      title: title,
      titleColor: '#808080',
      message: message,
      buttons: [{ Id: 1, Name: 'OK' }],
    });
  }

  AlertError(err: any, title: string = 'Error') {
    const error = DialogHelper.GetFriendlyError(err);
    return this.ShowMessageDialog({
      title: title,
      titleColor: '#E91E63',
      message: error,
      icon: 'error',
      buttons: [{ Id: 1, Name: 'OK' }],
    });
  }

  AlertWarning(message: string, title: string = 'Warning') {
    return this.ShowMessageDialog({
      title: title,
      titleColor: '#FFB300',
      message: message,
      icon: 'warning',
      buttons: [{ Id: 1, Name: 'OK' }],
    });
  }

  AlertSuccess(message: string, title: string = 'Success') {
    return this.ShowMessageDialog({
      title: title,
      titleColor: '#4CAF50',
      message: message,
      icon: 'check',
      buttons: [{ Id: 1, Name: 'OK' }],
    });
  }

  toastOpts = {
    class: 'toast',
    theme: 'dark',
    icon: 'material-icons',
    messageSize: 12,
    position: 'center',
    transitionIn: 'flipInX',
    close: false,
    closeOnClick: true,
    overlayClose: true,
    layout: 2,
  };

  ToastWarning(message: string, title: string = 'Warning', timeout = 2000) {
    this.zone.runOutsideAngular(() => {
      const opts: any = Object.assign(
        {
          message: message,
          title: title,
          iconText: 'warning',
          iconColor: '#FFEB3B',
          messageColor: '#FFEB3B',
          progressBarColor: 'rgb(255, 235, 59)',
          backgroundColor: 'rgba(40, 40, 40, .9)',
        },
        this.toastOpts
      );
      if (timeout > 0) {
        opts.overlay = true;
        opts.timeout = timeout;
      } else {
        opts.close = true;
        opts.timeout = 1000;
        opts.progressBar = false;
      }

      iziToast.show(opts);
    });
  }

  ToastSuccess(message: string, title: string = 'Success', timeout = 2000) {
    this.zone.runOutsideAngular(() => {
      const opts: any = Object.assign(
        {
          message: message,
          title: title,
          iconText: 'done_all',
          iconColor: '#4CAF50',
          messageColor: '#FFF8E1',
          backgroundColor: 'rgba(40, 40, 40, .9)',
          progressBarColor: 'rgb(0, 255, 184)',
        },
        this.toastOpts
      );
      if (timeout > 0) {
        opts.overlay = true;
        opts.timeout = timeout;
      } else {
        opts.close = true;
        opts.timeout = 1000;
        opts.progressBar = false;
      }

      iziToast.show(opts);
    });
  }

  ToastWithTimeOut(
    condition = 'Success',
    message: string,
    title: string = 'Success',
    timeout = 2000,
    overlay = true
  ) {
    this.zone.runOutsideAngular(() => {
      const opts: any = Object.assign(
        {
          message: message,
          title: title,
          iconText: condition == 'Success' ? 'done_all' : 'warning',
          iconColor: condition == 'Success' ? '#4CAF50' : '#FFEB3B',
          messageColor: condition == 'Success' ? '#FFF8E1' : '#FFEB3B',
          progressBarColor:
            condition == 'Success' ? 'rgb(0, 255, 184)' : 'rgb(255, 235, 59)',
          backgroundColor: 'rgba(40, 40, 40, .9)',
          overlay: overlay,
          timeout: timeout,
        },
        this.toastOpts
      );

      if (timeout <= 0) {
        opts.close = true;
        opts.progressBar = false;
      }

      iziToast.show(opts);
    });
  }

  Confirm(message: string, title: string = 'Confirmation'): Promise<boolean> {
    return lastValueFrom(
      this.dialog
        .open(PopUpDialogComponent, {
          disableClose: true,
          data: {
            titleColor: '#E91E63',
            title: title,
            message: message,
            buttons: [
              { Id: 1, Name: 'Yes' },
              { Id: 0, Name: 'No' },
            ],
          },
        })
        .afterClosed()
    );
  }

  AlertFormError(err: any, title: string = 'Form Error') {
    const error = DialogHelper.GetFriendlyError(err);
    let detailed = null;
    // !environment.production &&
    if (
      err instanceof HttpErrorResponse &&
      !(err.error instanceof Error) &&
      err.status === 500 &&
      err.headers &&
      err.headers.get('content-type') &&
      err.headers.get('content-type')!.indexOf('text/html') >= 0
    ) {
      detailed = err.error;
    }

    this.ShowMessageDialog({
      title: title,
      titleColor: '#E91E63',
      message: 'Unable to load form data. Please try again.\n' + error,
      icon: 'error',
      buttons: [
        { Id: 1, Name: 'Back' },
        { Id: 2, Name: 'Reload' },
      ],
      detailed: detailed,
    }).subscribe((res: any) => {
      if (res === 1) {
        window.history.back();
      } else {
        window.location.reload();
      }
    });
  }
}

export interface IDialogOptions {
  icon?: string;
  title: string;
  message: string;
  titleColor?: string;
  buttons: any;
  detailed?: string;
}
