/**
 * Result モナドの実装例
 * 関数型エラーハンドリングの基盤
 */

// 基本的なResult型
export type Result<T, E> = Ok<T> | Error<E>

export type Ok<T> = {
  readonly type: 'Ok'
  readonly value: T
}

export type Error<E> = {
  readonly type: 'Error'
  readonly error: E
}

// コンストラクタ
export const Result = {
  ok: <T>(value: T): Ok<T> => ({
    type: 'Ok',
    value,
  }),

  error: <E>(error: E): Error<E> => ({
    type: 'Error',
    error,
  }),

  // 型ガード
  isOk: <T, E>(result: Result<T, E>): result is Ok<T> => 
    result.type === 'Ok',

  isError: <T, E>(result: Result<T, E>): result is Error<E> => 
    result.type === 'Error',

  // ファンクター: 成功値に関数を適用
  map: <T, U, E>(f: (value: T) => U) => 
    (result: Result<T, E>): Result<U, E> => {
      if (result.type === 'Ok') {
        return Result.ok(f(result.value))
      }
      return result
    },

  // モナド: 成功値にResult返す関数を適用
  flatMap: <T, U, E>(f: (value: T) => Result<U, E>) => 
    (result: Result<T, E>): Result<U, E> => {
      if (result.type === 'Ok') {
        return f(result.value)
      }
      return result
    },

  // エラー値の変換
  mapError: <T, E, F>(f: (error: E) => F) => 
    (result: Result<T, E>): Result<T, F> => {
      if (result.type === 'Error') {
        return Result.error(f(result.error))
      }
      return result
    },

  // デフォルト値の提供
  withDefault: <T>(defaultValue: T) => 
    <E>(result: Result<T, E>): T => {
      if (result.type === 'Ok') {
        return result.value
      }
      return defaultValue
    },

  // 非同期操作のラップ
  fromPromise: async <T, E = Error>(
    promise: Promise<T>,
    onError: (error: unknown) => E
  ): Promise<Result<T, E>> => {
    try {
      const value = await promise
      return Result.ok(value)
    } catch (error) {
      return Result.error(onError(error))
    }
  },

  // 複数のResultを結合
  all: <T, E>(results: Result<T, E>[]): Result<T[], E> => {
    const values: T[] = []
    for (const result of results) {
      if (result.type === 'Error') {
        return result
      }
      values.push(result.value)
    }
    return Result.ok(values)
  },
}

// パイプライン用のヘルパー関数
export const pipe = <T>(value: T) => ({
  then: <U>(f: (value: T) => U) => pipe(f(value)),
  value: () => value,
})

// Result用のパイプライン演算子
export const andThen = <T, U, E>(
  f: (value: T) => Result<U, E>
) => Result.flatMap(f)

export const orElse = <T, E, F>(
  f: (error: E) => Result<T, F>
) => <T>(result: Result<T, E>): Result<T, F> => {
  if (result.type === 'Error') {
    return f(result.error)
  }
  return result
}

// パターンマッチング用のヘルパー
export const match = <T, E, R>(result: Result<T, E>) => ({
  ok: (f: (value: T) => R) => ({
    error: (g: (error: E) => R): R => {
      if (result.type === 'Ok') {
        return f(result.value)
      }
      return g(result.error)
    },
  }),
})

// 実用例: バリデーション
type ValidationError = {
  field: string
  message: string
}

export const validate = {
  required: (field: string) => 
    (value: string | undefined): Result<string, ValidationError> => {
      if (!value || value.trim() === '') {
        return Result.error({
          field,
          message: `${field} is required`,
        })
      }
      return Result.ok(value)
    },

  email: (field: string) => 
    (value: string): Result<string, ValidationError> => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return Result.error({
          field,
          message: `${field} must be a valid email`,
        })
      }
      return Result.ok(value)
    },

  minLength: (field: string, min: number) => 
    (value: string): Result<string, ValidationError> => {
      if (value.length < min) {
        return Result.error({
          field,
          message: `${field} must be at least ${min} characters`,
        })
      }
      return Result.ok(value)
    },
}

// 実用例: 複数のバリデーションを組み合わせる
export const validateEmail = (email: string): Result<string, ValidationError> =>
  pipe(email)
    .then(validate.required('email'))
    .then(andThen(validate.email('email')))
    .value()

// 実用例: 非同期操作との組み合わせ
export const fetchUser = async (id: string): Promise<Result<User, ApiError>> => {
  return Result.fromPromise(
    fetch(`/api/users/${id}`).then(res => res.json()),
    (error) => ({
      type: 'NetworkError' as const,
      message: String(error),
    })
  )
}

// 型定義（例）
type User = {
  id: string
  email: string
  name: string
}

type ApiError = 
  | { type: 'NetworkError'; message: string }
  | { type: 'NotFound' }
  | { type: 'Unauthorized' }