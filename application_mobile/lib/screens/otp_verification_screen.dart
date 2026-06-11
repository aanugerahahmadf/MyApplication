import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import 'reset_password_screen.dart';

enum OtpType { emailVerification, resetPassword }

class OtpVerificationScreen extends StatefulWidget {
  final String email;
  final OtpType type;

  const OtpVerificationScreen({super.key, required this.email, required this.type});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final _otpController = TextEditingController();
  bool _isLoading = false;

  Future<void> _verifyOtp() async {
    setState(() => _isLoading = true);
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final purpose = widget.type == OtpType.resetPassword ? 'reset_password' : 'email_verification';
      await apiService.verifyOtp(widget.email, _otpController.text, purpose);
      if (mounted) {
        if (widget.type == OtpType.resetPassword) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => ResetPasswordScreen(
                email: widget.email,
                otp: _otpController.text,
              ),
            ),
          );
        } else {
          final authProvider = Provider.of<AuthProvider>(context, listen: false);
          await authProvider.fetchProfile();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Email verified successfully')),
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verify OTP')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'A verification code has been sent to ${widget.email}. Please enter it below.',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, letterSpacing: 8),
              decoration: const InputDecoration(
                hintText: '000000',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _verifyOtp,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: const Color(0xFF6366F1),
                foregroundColor: Colors.white,
              ),
              child: _isLoading 
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text('Verify'),
            ),
            TextButton(
              onPressed: () {
                final purpose = widget.type == OtpType.resetPassword ? 'reset_password' : 'email_verification';
                Provider.of<ApiService>(context, listen: false).sendOtp(widget.email, purpose);
              },
              child: const Text('Resend Code'),
            ),
          ],
        ),
      ),
    );
  }
}
