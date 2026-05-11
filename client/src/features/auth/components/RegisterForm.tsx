'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(2, 'กรุณากรอกนามสกุล'),
  role: z.enum(['user', 'owner']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">สมัครสมาชิก</h2>
      
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ชื่อ"
          placeholder="ชื่อจริง"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="นามสกุล"
          placeholder="นามสกุล"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="อีเมล"
        type="email"
        placeholder="example@mail.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="รหัสผ่าน"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <Input
        label="ยืนยันรหัสผ่าน"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="focus:outline-none hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />


      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">ประเภทบัญชี</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="user" {...register('role')} className="text-primary" />
            <span className="text-sm">ผู้ใช้งานทั่วไป</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="owner" {...register('role')} className="text-primary" />
            <span className="text-sm">เจ้าของที่พัก</span>
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        สมัครสมาชิก
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-4">
        มีบัญชีอยู่แล้ว?{' '}
        <Link href="/login" className="text-secondary font-semibold hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
};
