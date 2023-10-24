export interface FormData {
  formItems: {
    value: string,
    type: string,
    options?: string[]
  }[]
}

export interface UserInfo {
  field: string,
  value: string
}

export interface GameEntry {
  file: string,
  posX: number,
  posY: number,
  width: number,
  height: number,
  find_pos: boolean,
  check_errors?: boolean,
  target?: string,
  present?: boolean,
  num_shapes?: number,
  conjunction?: any,
  target_color?: any,
  target_shape?: any
}
