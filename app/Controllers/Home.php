<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('pages/home');
    }
    
    public function services(): string
    {
        return view('pages/services');
    }
    
    public function process(): string
    {
        return view('pages/process');
    }
    
    public function portfolio(): string
    {
        return view('pages/portfolio');
    }
    
    public function about(): string
    {
        return view('pages/about');
    }
    
    public function contact(): string
    {
        return view('pages/contact');
    }
    
    public function submitContact()
    {
        // CSRF 토큰 검증
        if (!$this->validateData($this->request->getPost(), [
            'name' => 'required|min_length[2]|max_length[100]',
            'company' => 'permit_empty|max_length[100]',
            'email' => 'required|valid_email|max_length[255]',
            'phone' => 'required|max_length[20]',
            'message' => 'required|min_length[10]|max_length[2000]'
        ])) {
            return redirect()->back()
                ->withInput()
                ->with('errors', $this->validator->getErrors());
        }

        $data = [
            'name' => $this->request->getPost('name'),
            'company' => $this->request->getPost('company'),
            'email' => $this->request->getPost('email'),
            'phone' => $this->request->getPost('phone'),
            'message' => $this->request->getPost('message'),
        ];

        try {
            $contactModel = new \App\Models\Contact();
            
            if ($contactModel->insert($data)) {
                return redirect()->to('/contact')->with('success', '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
            } else {
                return redirect()->back()
                    ->withInput()
                    ->with('error', '문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (\Exception $e) {
            log_message('error', 'Contact submission error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
}

