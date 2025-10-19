<?php

namespace App\Models;

use CodeIgniter\Model;

class Contact extends Model
{
    protected $table = 'contacts';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['name', 'company', 'email', 'phone', 'message', 'status'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'name' => 'required|min_length[2]|max_length[100]',
        'email' => 'required|valid_email|max_length[255]',
        'phone' => 'required|max_length[20]',
        'message' => 'required|min_length[10]|max_length[2000]',
    ];
    protected $validationMessages = [
        'name' => [
            'required' => '이름을 입력해주세요.',
            'min_length' => '이름은 최소 2자 이상이어야 합니다.',
        ],
        'email' => [
            'required' => '이메일을 입력해주세요.',
            'valid_email' => '올바른 이메일 형식이 아닙니다.',
        ],
        'phone' => [
            'required' => '연락처를 입력해주세요.',
        ],
        'message' => [
            'required' => '문의 내용을 입력해주세요.',
            'min_length' => '문의 내용은 최소 10자 이상이어야 합니다.',
        ],
    ];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
}

