import { Component, EventEmitter, Output } from '@angular/core';
import { FormEndpointsService } from "../services/form-endpoints.service";
import { FormData, UserInfo } from "../constants/common.enum"

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {

  @Output() formSubmission = new EventEmitter<any>();

  constructor(private formEndpointsService: FormEndpointsService) { }

  formData: FormData | undefined;
  savedFormData: UserInfo[] = [];
  userID: number | undefined;

  // Get users data
  ngOnInit(): void {
    this.formEndpointsService.getFormData().subscribe(res => {
      this.formData = res;
    }, error => {
      this.formData = {
        formItems: [
          { value: "Full Name", type: "string" },
          { value: "Age", type: "number" },
          { value: "Sex", type: "select", options: ["Male" ,"Female", "Prefer not to say"]}
        ]
      }
    });
  }

  saveFormData(event: any): void {
    event.preventDefault();
    for (let input of event?.target?.querySelectorAll('div')) {
      this.savedFormData.push({field: input?.querySelector('input, select')?.name, value: input?.querySelector('input, select')?.value});
    }
    this.formEndpointsService.getUserID(this.savedFormData).subscribe(res => {
      this.userID = res;
      localStorage.setItem('userID', `${this.userID}`);
      this.formSubmission.emit(this.userID);
    }, error => {
      this.userID = 1;
      localStorage.setItem('userID', `${this.userID}`);
      this.formSubmission.emit(this.userID);
    });
  }
}
