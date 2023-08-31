import { Component } from '@angular/core';
import { FormEndpointsService } from "../services/form-endpoints.service";

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {

  constructor(private formEndpointsService: FormEndpointsService) { }

  formData: { formItems: {value: string, type: string, options?: string[]}[] } | undefined;
  savedFormData: {field: string, value: string}[] = [];

  // Get users data
  ngOnInit(): void {
    this.formEndpointsService.getFormData().subscribe(res => {
      this.formData = res;
    }, error => {
      this.formData = {
        formItems: [
          { value: "First Name", type: "string" },
          { value: "Last Name", type: "string" },
          { value: "Age", type: "number" },
          { value: "Gender", type: "select", options: ["Male" ,"Female", "Prefer not to say"]}
        ]
      }
    });
  }

  saveFormData(event: any): void {
    event.preventDefault();
    for (let input of event?.target?.querySelectorAll('div')) {
      this.savedFormData.push({field: input?.querySelector('input, select')?.name, value: input?.querySelector('input, select')?.value});
    }
    localStorage.setItem('userInfo', JSON.stringify(this.savedFormData));
  }
}