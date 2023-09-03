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
  userID: any;

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

  saveFormData(event: any, repeat: boolean = false, counter: number = 0): void {
    if (!repeat) {
      event.preventDefault();
      for (let input of event?.target?.querySelectorAll('div')) {
        this.savedFormData.push({field: input?.querySelector('input, select')?.name, value: input?.querySelector('input, select')?.value});
      }
    }
    if (counter < 10) {
      this.formEndpointsService.getUserID(this.savedFormData).subscribe(res => {
        this.userID = res.user_id;
        localStorage.setItem('userID', `${res.user_id}`);
        this.formSubmission.emit(this.userID);
      }, error => {
        console.log(error);
        this.saveFormData(event, true, counter + 1);
      });
    }
  }
}
